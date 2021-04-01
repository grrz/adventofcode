$inout = {}
$outin = {}

def _input()
	f = File.open('2020-07-input')
	# clear bronze bags contain 1 plaid gold bag, 4 pale tan bags, 1 light teal bag, 5 dim lavender bags.

	f.read.split("\n").each { |l| 
		m = l.match /^(\w+\s\w+) bags contain (.*)\.$/
		outer = m[1]
		m[2].split(',').each { |l1|
			#  1 light teal bag
			m1 = l1.match /(\d+) (\w+ \w+) bag/
			# m1 = [0, 'none', 0] unless m1 # if no other bags
			if m1
				$inout[m1[2]] = {} if $inout[m1[2]].nil?
				$inout[m1[2]][outer] = m1[1].to_i
				$outin[outer] = {} if $outin[outer].nil?
				$outin[outer][m1[2]] = m1[1].to_i
			end
		}
	}
end

$l = 0

def _count_inout_int(bag)
	return [bag] if $inout[bag].nil?

	n = [bag]
	# pp "#{' ' * $l}#{bag} → #{$inout[bag].keys.join ' | '}"
	# pp "#{' ' * $l}#{bag} #{$inout[bag].keys.size} → #{$inout[bag].keys.join ' | '}"
	$l += 1
	$inout[bag].keys.each { |i| n = n.union(_count_inout_int(i)) }
	$l -= 1
	n
end

def _count_inout(bag)
	$l = 0
	c = _count_inout_int(bag) - [bag]
	c.size
end

def _count_outin_int(bag)
	return 1 if $outin[bag].nil?

	n = 1
	pp "#{' ' * $l}#{bag} → #{$outin[bag].keys.join ' | '}"
	$l += 1
	$outin[bag].keys.each { |i|
		n += _count_outin_int(i) * $outin[bag][i]
		pp "#{' ' * $l}#{bag}: #{$outin[bag][i]} * #{i}"
	}
	$l -= 1
	n
end


_input()

# pp _count_inout('shiny gold')
pp _count_outin_int('shiny gold') - 1
# pp _count_outin_int('muted teal') - 1
