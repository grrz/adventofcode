input_t = 1006401
input_s = '17,x,x,x,x,x,x,x,x,x,x,37,x,x,x,x,x,449,x,x,x,x,x,x,x,23,x,x,x,x,13,x,x,x,x,x,19,x,x,x,x,x,x,x,x,x,x,x,607,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,29'
# input_s = '1789,37,47,1889'
# input_s = '17,x,13,19'
# input_s = '67,7,x,59,61'
input_s = input_s.split ','

#1
# pp buses1 = input_s.filter { |i| i != 'x' }.map(&:to_i).sort
# pp buses1.map { |b| input_t / b * b + b - input_t }

#2
i = 0
bt = {}
input_s.each { |b|
	bt[b.to_i] = i if b != 'x'
	i += 1
}

bus_numbers = bt.keys.sort.reverse
bus_deltas = bus_numbers.map { |b| bt[b] - bt[bus_numbers[0]] }

_step = bus_numbers[0]
matches = [0]
matches_found = 1
matches_max = bus_numbers.size - 1

t = 0

while true
	t += _step

	for b in matches_found..bus_numbers.size-1
		break	if (t + bus_deltas[b]) % bus_numbers[b] > 0

		if matches[b].nil?
			matches[b] = t
		else
			matches_found += 1
			_step = t - matches[b]
			pp "match #{b}: #{bus_numbers[b]}, new step: #{_step}"
		end
	end

	break if matches_found == bus_numbers.size
end

pp t + bus_deltas.min - _step
