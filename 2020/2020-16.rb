def _input()
	f = File.open('2020-16-input')
	f.read.split("\n").map { |l| l.split(',').map(&:to_i) }
end

rules_raw = [
	'departure location: 36-269 or 275-973',
	'departure station: 25-237 or 245-972',
	'departure platform: 34-576 or 586-967',
	'departure track: 48-199 or 206-959',
	'departure date: 31-172 or 194-962',
	'departure time: 34-448 or 454-955',
	'arrival location: 42-400 or 419-965',
	'arrival station: 36-528 or 551-956',
	'arrival platform: 46-456 or 466-960',
	'arrival track: 48-293 or 303-966',
	'class: 50-796 or 818-950',
	'duration: 46-589 or 610-957',
	'price: 38-55 or 66-957',
	'route: 37-144 or 154-961',
	'row: 48-832 or 853-949',
	'seat: 40-495 or 516-952',
	'train: 32-429 or 441-971',
	'type: 27-338 or 355-955',
	'wagon: 42-473 or 488-973',
	'zone: 26-379 or 386-972'
]

ticket = [127,109,139,113,67,137,71,97,53,103,163,167,131,83,157,101,107,79,73,89]
# ticket = [ 974,283,266,637,119,712,555,718,872,424,828,751,364,159,611,296,659,741,264,334]

rules = rules_raw.map { |r| rr = r.match(/([\w\d\s]+): (\d+)-(\d+) or (\d+)-(\d+)/); [rr[1], rr[2..5].map(&:to_i)] }.to_h
data_check = rules.map { |k, v| [k, (0..ticket.size-1).map { |i| [i, 1] }.to_h] }.to_h

def check_ticket(rules, t, data_check)
	bad = []
	not_found = {}
	for place in 0..t.size-1
		# v = check_rules(rules, t[place])
		v = t[place]
		ok = false
		rules.each { |k, r|
			# pp "check rule #{k} #{r} against #{v}"
			if ((v >= r[0] && v <= r[1]) || (v >= r[2] && v <= r[3]))
				# rule ok with this place
				ok = true
			else
				# rule failed for this place
				if not_found[k].nil?
					not_found[k] = [place]
				else
					not_found[k].push place
				end
			end
		}

		bad.push v unless ok
	end

	if bad.sum == 0
		pp "not found: #{not_found}"
		not_found.each { |k, v|
			v.each { |i| data_check[k].delete i }
		}
	else
		pp "bad ticket: #{t}"
	end

	bad.sum
end

def normalize_data(dc)
	dc = dc.map { |k,v| [k, v.keys] }.sort { |a,b| a[1].size <=> b[1].size }

	for k in 0..dc.size-2
		for i in k+1..dc.size-1
			dc[i][1] -= dc[k][1]
		end
	end
	dc
end

#1
# bad = []
# bad.push check_ticket(rules, ticket)
# _input.each { |t| bad.push check_ticket(rules, t) }
# pp bad.sum

#2
_input.each { |t| check_ticket(rules, t, data_check) }

res = 1

normalize_data(data_check).each { |i|
	if i[0].match /^departure/
		res *= ticket[i[1][0]]
	end
}

pp res