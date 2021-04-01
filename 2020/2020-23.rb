_input = '398254716'.split('').map(&:to_i)
# _input = '389125467'.split('').map(&:to_i) # test

def _dest(d)
	$t.index(d-1) || _dest(d <= 2 ? $t.max+1 : d-1)
end

def deal
	cpop = $t.slice!(0, 4)
	curr = cpop.shift

	$t.insert _dest(curr) + 1, *cpop
	$t.push curr
end

def deal2
	cpop = $t.slice!($i+1, 3)
	d = _dest($t[$i]) + 1
	$t.insert d, *cpop
	$i += d > $i ? 1 : 4
	if $t.size - $i < 4
		$t = $t[$i..-1] + $t[0..$i-1]
		$i = 0
		p '#'
	end
end

def res1(t)
	i = $t.index 1

	if i == 0
		return t[1..-1].join('')
	elsif i == t.size-1
		return t[0..-2].join('')
	else
		return t[i+1..-1].join('') + t[0..i-1].join('')
	end
end

#1
# $t = _input
# (1..100).each {	deal() }
# p res1 $t

#2
$t = _input + (10..1000000).to_a
$i = 0

t1 = Time.now
for n in (1..100)
# for n in (1..10_000_000)
	deal2()
	p n if n % 1000 == 0
end
t2 = Time.now

i = $t.index 1
p "#{i}, #{$t[i+1]} * #{$t[i+2]} = #{$t[i+1] * $t[i+2]}"
p "time: #{t2-t1} s"